import "reflect-metadata";
import { DataSource } from "typeorm";
import { Appointment } from "./models/Appointment";
import { Portfolio } from "./models/Portfolio";
import { Role } from "./models/Role";
import { User } from "./models/User";
import { Appointment_porfolio } from "./models/Appointment_portfolio";
import { CreateRolesTable1698496299691 } from "./migration/1698496299691-create-roles-table";
import { CreateUsersTable1698496415236 } from "./migration/1698496415236-create-users-table";
import { CreateAppointmentsTable1698496506955 } from "./migration/1698496506955-create-appointments-table";
import { CreatePortfolioTable1698496603673 } from "./migration/1698496603673-create-portfolio-table";
import { CreateAppointmentPortfolioTable1698496659685 } from "./migration/1698496659685-create-appointment_portfolio-table";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "tattoo_studio_db",
    migrations: [CreateRolesTable1698496299691, CreateUsersTable1698496415236, CreateAppointmentsTable1698496506955,
        CreatePortfolioTable1698496603673, CreateAppointmentPortfolioTable1698496659685],
    entities: [Appointment, Portfolio, Role, User, Appointment_porfolio],
    synchronize: false,
    logging: false,
});
