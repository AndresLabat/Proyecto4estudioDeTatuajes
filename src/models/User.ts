import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("users")
export class User extends BaseEntity {
@PrimaryGeneratedColumn()
id!: number

@Column()
full_name!: string

@Column()
email!: 

@Column()
password!: 

@Column()
phone_number!: number

@Column()
is_active!: boolean

@Column()
created_at!: 

@Column()
updated_at!: 

}
