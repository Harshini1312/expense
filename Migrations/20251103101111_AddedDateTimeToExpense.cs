using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UseCaseWeb.Migrations
{
    /// <inheritdoc />
    public partial class AddedDateTimeToExpense : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SpendDate",
                table: "Expenses",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SpendDate",
                table: "Expenses");
        }
    }
}
