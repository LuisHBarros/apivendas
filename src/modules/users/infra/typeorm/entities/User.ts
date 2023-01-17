import { Column, CreateDateColumn, Entity, PrimaryColumnCannotBeNullableError, PrimaryGeneratedColumn } from "typeorm";
import { Exclude, Expose } from 'class-transformer'
import { IUser } from "@modules/users/domain/models/IUsers";

@Entity('users')
class User implements IUser{
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	@Exclude()
	password: string;

	@Column()
	avatar: string;

	@CreateDateColumn()
	created_at: Date;

	@CreateDateColumn()
	updated_at: Date;

	@Expose({ name: 'avatar_url' })
	getAvatarUrl(): string | null{
		if (!this.avatar)
			return null;
		return `${process.env.API_URL}/files/${this.avatar}`
	};
}

export default User;