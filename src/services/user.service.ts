import { UserRepository } from '../database/repositories/user.repository';

export class UserServices {
  static async isRegistered(id: string) {
    const User = await UserRepository.findOneBy({ discord_id: id });
    // if (!User) {
    //   const newUser = UserRepository.create({
    //     UserId: payload.id,
    //   });
    //   return await UserRepository.save(newUser);
    // }
    return User;
  }
  //     static async CreateOrUpdate(payload: { id: string }) {
  //     const User = await UserRepository.findOneBy({ discord_id: payload.id });
  //     if (!User) {
  //       const newUser = UserRepository.create({
  //         UserId: payload.id,
  //       });
  //       return await UserRepository.save(newUser);
  //     }
  //     return User;
  //   }
  //   static async Delete(payload: { id: string }) {
  //     const User = await UserRepository.findOneBy({ UserId: payload.id });
  //     if (User) await UserRepository.delete({ UserId: payload.id });
  //   }
  //   static async findOne(options: FindOneOptions<UserEntity>['where']) {
  //     return await UserRepository.findOneOrFail({
  //       where: options,
  //     });
  //   }
  //   static async update(payload: UserEntity) {
  //     const User = await UserRepository.findOneByOrFail({
  //       UserId: payload.UserId,
  //     });
  //     UserRepository.merge(User, payload);
  //     return await UserRepository.save(User);
  //   }
}
