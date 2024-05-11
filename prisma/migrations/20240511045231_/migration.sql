-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "layout" TEXT NOT NULL,
    "dark_mode" TEXT,
    "background" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "property" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "journal_order" INTEGER NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_metric_data" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metric_value" DOUBLE PRECISION NOT NULL,
    "goal_value" INTEGER,
    "user_id" INTEGER NOT NULL,
    "metric_id" INTEGER NOT NULL,

    CONSTRAINT "User_metric_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Metric_journal_order_key" ON "Metric"("journal_order");

-- AddForeignKey
ALTER TABLE "User_metric_data" ADD CONSTRAINT "User_metric_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_metric_data" ADD CONSTRAINT "User_metric_data_metric_id_fkey" FOREIGN KEY ("metric_id") REFERENCES "Metric"("id") ON DELETE CASCADE ON UPDATE CASCADE;
