import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });

const developmentUploadConfig = {
	SecretId: process.env.DEV_TENTCENT_SECRET_ID,
	SecretKey: process.env.DEV_TENTCENT_SECRET_KEY,
	Bucket: process.env.DEV_COS_BUCKET_PUBLIC,
	Region: process.env.DEV_COS_REGION,
};

const productionUploadConfig = {
	SecretId: process.env.PRO_TENTCENT_SECRET_ID,
	SecretKey: process.env.PRO_TENTCENT_SECRET_KEY,
	Bucket: process.env.PRO_COS_BUCKET_PUBLIC,
	Region: process.env.PRO_COS_REGION,
};

const config = process.env.NODE_ENV == 'production' ? developmentUploadConfig : productionUploadConfig;

export default config;
