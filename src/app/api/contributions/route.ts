// ============================================
// src/app/api/contributions/route.ts
// API Route pour les contributions
// ============================================

import { ContributionService } from "@/entities/contribution/model/contribution.service";
import { NextRequest, NextResponse } from "next/server";


// POST /api/contributions - Créer une contribution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await ContributionService.createContribution(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: { message: error instanceof Error ? error.message : 'Erreur serveur' }
      },
      { status: 500 }
    );
  }
}