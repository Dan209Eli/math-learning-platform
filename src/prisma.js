// 1. Import the PrismaClient tool from our installed package
const { PrismaClient } = require('@prisma/client');

// 2. Create ONE single master key (instance) to talk to our database
const prisma = new PrismaClient();

// 3. Export this master key so server.js can use it
module.exports = prisma;