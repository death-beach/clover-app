import axios, { AxiosError } from 'axios';

const HELIO_APP_URL = process.env.HELIO_APP_URL;

async function verifyDeployment() {
  try {
    console.log('🔍 Checking application health...');
    const healthResponse = await axios.get(`${HELIO_APP_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    console.log('\n🔍 Verifying Helio configuration...');
    const configResponse = await axios.get(`${HELIO_APP_URL}/api/config/verify`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HELIO_API_KEY}`
      }
    });
    console.log('✅ Helio configuration verified:', configResponse.data);

    console.log('\n🔍 Testing API connectivity...');
    const connectivityResponse = await axios.get(`${HELIO_APP_URL}/api/status`);
    console.log('✅ API connectivity confirmed:', connectivityResponse.data);

    console.log('\n✨ Deployment verification completed successfully!');
  } catch (error) {
    const err = error as AxiosError;
    console.error('❌ Deployment verification failed:', err.message || String(err));
    if (err.response) {
      console.error('Error details:', err.response.data);
    }
    process.exit(1);
  }
}

verifyDeployment();