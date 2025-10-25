import { ProjectService } from '@/entities/project/model/project.service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/projects/:id - Récupérer un projet
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await ProjectService.getProjectWithContributions(params.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error?.code === 'NOT_FOUND' ? 404 : 400 }
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

// PATCH /api/projects/:id - Mettre à jour un projet
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const result = await ProjectService.updateProject(params.id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error?.code === 'NOT_FOUND' ? 404 : 400 }
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

// DELETE /api/projects/:id - Supprimer un projet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await ProjectService.deleteProject(params.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error?.code === 'NOT_FOUND' ? 404 : 400 }
      );
    }

    return NextResponse.json({ success: true, data: null });
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