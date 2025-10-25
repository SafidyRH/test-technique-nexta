import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/entities/project/model/project.service';
import { projectFiltersSchema } from '@/shared/lib/validations';

// GET /api/projects - Liste des projets avec filtres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query params
    const filters = {
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      isFunded: searchParams.get('isFunded') === 'true' ? true : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'date',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    };

    // Validation
    const validatedFilters = projectFiltersSchema.parse(filters);

    const result = await ProjectService.getAllProjects(
      validatedFilters,
      validatedFilters.sortBy,
      validatedFilters.sortOrder
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
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

// POST /api/projects - Créer un nouveau projet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await ProjectService.createProject(body);

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



