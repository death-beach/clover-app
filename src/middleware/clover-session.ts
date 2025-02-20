import { type NextRequest, NextResponse } from 'next/server';
import { getCloverAPIClient } from '@/lib/clover/api-client';

export async function validateCloverSession(request: NextRequest) {
  const sessionToken = request.cookies.get('clover_session')?.value;
  const merchantId = request.cookies.get('clover_merchant_id')?.value;
  const employeeId = request.cookies.get('clover_employee_id')?.value;

  if (!sessionToken || !merchantId || !employeeId) {
    return false;
  }

  try {
    const apiClient = getCloverAPIClient(merchantId);
    return await apiClient.validateSession();
  } catch (error) {
    console.error('Error validating Clover session:', error);
    return false;
  }
}

export function handleUnauthorized() {
  // Clear invalid session cookies
  const response = NextResponse.redirect(new URL('/auth/login', process.env.NEXTAUTH_URL));
  response.cookies.delete('clover_session');
  response.cookies.delete('clover_merchant_id');
  response.cookies.delete('clover_employee_id');
  return response;
}