import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreatePortfolioTable1698496603673 implements MigrationInterface {

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
                        length: "100",
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
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "price",
                        type: "float",
                        length: "10",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
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