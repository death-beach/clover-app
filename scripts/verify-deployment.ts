import axios from 'axios';

const HELIO_APP_URL = process.env.HELIO_APP_URL;

async function verifyDeployment() {
  try {
    // 1. Check health endpoint
    console.log('🔍 Checking application health...');
    const healthResponse = await axios.get(`${HELIO_APP_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // 2. Verify Helio configuration
    console.log('\n🔍 Verifying Helio configuration...');
    const configResponse = await axios.get(`${HELIO_APP_URL}/api/config/verify`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HELIO_API_KEY}`
      }
    });
    console.log('✅ Helio configuration verified:', configResponse.data);

    // 3. Test basic connectivity
    console.log('\n🔍 Testing API connectivity...');
    const connectivityResponse = await axios.get(`${HELIO_APP_URL}/api/status`);
    console.log('✅ API connectivity confirmed:', connectivityResponse.data);

    console.log('\n✨ Deployment verification completed successfully!');
  } catch (error) {
    console.error('❌ Deployment verification failed:', error instanceof Error ? error.message : String(error));
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    process.exit(1);
  }
}

verifyDeployment();