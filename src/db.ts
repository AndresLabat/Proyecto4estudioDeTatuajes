import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1698247656405 } from "./migration/1698247656405-create-users-table";
import { CreateRolesTable1698249114687 } from "./migration/1698249114687-create-roles-table";
import { CreateRoleUserTable1698249832821 } from "./migration/1698249832821-create-role_user-table";
import { CreateClientsTable1698251418115 } from "./migration/1698251418115-create-clients-table";
import { CreateWorkersTable1698251793932 } from "./migration/1698251793932-create-workers-table";
import { CreateAppointmentsTable1698252374419 } from "./migration/1698252374419-create-appointments-table";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "tattoo_studio_db",
    migrations: [CreateUsersTable1698247656405, CreateRolesTable1698249114687, CreateRoleUserTable1698249832821,
        CreateClientsTable1698251418115, CreateWorkersTable1698251793932, CreateAppointmentsTable1698252374419],
    entities: [],
    synchronize: false,
    logging: false,
});
