import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = "http://193.203.161.174:3007";

export async function POST(req: NextRequest) {
  console.log('Orders API called');
  
  try {
    // Handle FormData (with files)
    const formData = await req.formData();
    console.log('FormData keys:', Array.from(formData.keys()));
    
    // Create a new FormData to send to backend
    const backendFormData = new FormData();
    
    // Copy all form data to backend FormData
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        backendFormData.append(key, value);
      } else {
        backendFormData.append(key, value);
      }
    }

    console.log('Forwarding to backend...');
    
    // Forward the request to the backend API
    const response = await fetch(`${BACKEND_API_URL}/api/orders`, {
      method: "POST",
      body: backendFormData,
      // Don't set Content-Type header for FormData - let browser set it with boundary
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      
      // Try to parse as JSON, fallback to text
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      return NextResponse.json(
        { 
          error: "Backend API error", 
          details: errorData,
          status: response.status 
        },
        { status: response.status }
      );
    }

    // Get the response data
    const responseData = await response.json();
    console.log("Order created successfully:", responseData);

    // Return the backend response
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });

  } catch (error: any) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error.message,
        details: {
          stack: error.stack,
          name: error.name
        }
      },
      { status: 500 }
    );
  }
}
