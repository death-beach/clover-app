import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCloverAPIClient } from '@/lib/clover/api-client';

export async function GET(request: NextRequest) {
  try {
    const merchantId = request.cookies.get('clover_merchant_id')?.value;
    const employeeId = request.cookies.get('clover_employee_id')?.value;

    if (!merchantId || !employeeId) {
      return NextResponse.json(
        { error: 'Missing merchant or employee ID' },
        { status: 401 }
      );
    }

    const apiClient = getCloverAPIClient(merchantId);
    const employee = await apiClient.getCurrentEmployee(employeeId);

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching Clover employee:', error);
    
    if ((error as any).status === 401) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch employee data' },
      { status: 500 }
    );
  }
}