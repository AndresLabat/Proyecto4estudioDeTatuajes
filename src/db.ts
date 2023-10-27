import "reflect-metadata";
import { DataSource } from "typeorm";
import { CreateUsersTable1698247656405 } from "./migration/1698247656405-create-users-table";
import { CreateRolesTable1698249114687 } from "./migration/1698249114687-create-roles-table";
import { CreateRoleUserTable1698249832821 } from "./migration/1698249832821-create-role_user-table";
import { CreateAppointmentsTable1698252374419 } from "./migration/1698252374419-create-appointments-table";
import { CreatePortfolioTable1698253274331 } from "./migration/1698253274331-create-portfolio-table";
import { CreateAppointmentPortfolioTable1698416402695 } from "./migration/1698416402695-create-appointment_portfolio-table";
import { Appointment } from "./models/Appointment";
import { Portfolio } from "./models/Portfolio";
import { Role_user } from "./models/Role_user";
import { Role } from "./models/Role";
import { User } from "./models/User";
import { Appointment_porfolio } from "./models/Appointment_portfolio";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "tattoo_studio_db",
    migrations: [CreateUsersTable1698247656405, CreateRolesTable1698249114687, CreateRoleUserTable1698249832821,
        CreateAppointmentsTable1698252374419, CreatePortfolioTable1698253274331, CreateAppointmentPortfolioTable1698416402695],
    entities: [Appointment, Portfolio, Role_user, Role, User, Appointment_porfolio],
    synchronize: false,
    logging: false,
});
