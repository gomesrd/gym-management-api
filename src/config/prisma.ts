import {PrismaClient} from '@prisma/client'

const dotenv = require('dotenv');
const path = require('path');

const envPath = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';

dotenv.config({path: path.resolve(__dirname, envPath)});

const prima = new PrismaClient();

export default prima;