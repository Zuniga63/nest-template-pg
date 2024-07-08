import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../auth/utils/hash-password';
import { SecureUser } from './interfaces/secure-user.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryImage } from '../cloudinary/interfaces';
import { CloudinaryPresets } from 'src/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    delete createUserDto.passwordConfirmation;
    createUserDto.password = hashPassword(createUserDto.password);

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    delete user.password;

    return user;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<SecureUser> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['role'] });
    return user;
  }

  async getFullUser(email: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async updateProfilePhoto(id: string, file: Express.Multer.File) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    const { profilePhotoPath: currentProfilePath } = user;
    let image: CloudinaryImage | undefined;

    try {
      // * Upload the image to Cloudinary
      image = await this.cloudinaryService.uploadImage({
        file,
        fileName: user.name,
        preset: CloudinaryPresets.PROFILE_PHOTO,
      });

      // * If the image is not uploaded, throw an error
      if (!image) throw new BadRequestException('Error uploading image');

      // * Update the user's profile photo path
      user.profilePhotoPath = image;
      await this.usersRepository.save(user);

      // * Delete the old profile photo if it exists

      if (currentProfilePath) {
        this.cloudinaryService.destroyFile(currentProfilePath.publicId);
      }

      return user;
    } catch (error) {
      this.logger.error(error);
      if (image) {
        this.logger.log('Deleting image');
        await this.cloudinaryService.destroyFile(image.publicId);
      }

      throw error;
    }
  }
}
