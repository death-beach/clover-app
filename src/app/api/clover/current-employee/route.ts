import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCloverAPIClient } from '@/lib/clover/api-client';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const merchantId = cookieStore.get('clover_merchant_id')?.value;
    const employeeId = cookieStore.get('clover_employee_id')?.value;

    if (!merchantId || !employeeId) {
      return NextResponse.json(
        { error: 'Missing merchant or employee ID' },
        { status: 401 }
      );
    }

    const apiClient = getCloverAPIClient(); // No merchantId here
    const employee = await apiClient.getCurrentEmployee(employeeId);

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching current employee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}