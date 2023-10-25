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
                        name: "name",
                        type: "varchar",
                        isNullable: false,
                        isUnique: true
                    },
                    {
                        name: "category",
                        type: "enum",
                        enum: ["tattoo", "piercing"],
                        isNullable: false
                    },
                    {
                        name: "image",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "price",
                        type: "float",
                        isNullable: false
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
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("portfolio")
    }

}
