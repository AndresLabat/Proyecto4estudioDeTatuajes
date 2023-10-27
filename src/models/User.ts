import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, BeforeInsert, getConnection } from "typeorm"
import { Role } from "./Role"
import { Role_user } from "./Role_user"

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    full_name!: string

    @Column()
    email!: string

    @Column()
    password!: string

    @Column()
    phone_number!: number

    @Column()
    is_active!: boolean

    @Column()
    created_at!: Date

    @Column()
    updated_at!: Date

    @ManyToMany(() => Role)
    @JoinTable({
        name: "role_user",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        }
    })
    userRoles!: Role[]

    @ManyToMany(() => User)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "client_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "worker_id",
            referencedColumnName: "id"
        }
    })
    clientWorkers!: User[]

    @ManyToMany(() => User)
    @JoinTable({
        name: "appointment",
        joinColumn: {
            name: "worker_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "client_id",
            referencedColumnName: "id"
        }
    })
    workerClients!: User[]
}


