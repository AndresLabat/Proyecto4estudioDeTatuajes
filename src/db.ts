import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1698247656405 } from "./migration/1698247656405-create-users-table";
import { CreateRolesTable1698249114687 } from "./migration/1698249114687-create-roles-table";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "tattoo_studio_db",
    migrations: [CreateUsersTable1698247656405, CreateRolesTable1698249114687],
    entities: [],
    synchronize: false,
    logging: false,
});
