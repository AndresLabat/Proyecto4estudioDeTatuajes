import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreatePortfolioTable1698253274331 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "portfolio",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "date",
                        type: "date",
                    },
                    {
                        name: "time",
                        type: "time",
                    },
                    {
                        name: "status",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "client_id",
                        type: "int",
                    },
                    {
                        name: "worker_id",
                        type: "int",
                    },
                    {
                        name: "created-at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated-at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["client_id"],
                        referencedTableName: "clients",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["worker_id"],
                        referencedTableName: "workers",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("portfolio")
    }

}
