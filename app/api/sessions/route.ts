import { NextRequest, NextResponse } from 'next/server';
import { getSessions, saveSessions } from '@/lib/storage-utils';
import { ENV } from '@/lib/env';
import { getUserSessions, upsertUserSession, addMessageToUserSession, deleteUserSession } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';

export async function GET() {
    // Prefer server-side authenticated user
    const authSession = await getServerSession(authOptions);
    const userId = (authSession?.user as any)?.id as string | null;

    if (ENV.MONGODB_URI && userId) {
        const sessions = await getUserSessions(userId);
        const sortedSessions = sessions.sort((a, b) => b.updatedAt - a.updatedAt);
        return NextResponse.json({ sessions: sortedSessions });
    }

    const sessions = await getSessions();
    // Sort by updatedAt desc
    const sortedSessions = sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    return NextResponse.json({ sessions: sortedSessions });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, session, sessionId, message, title } = body;

        let sessions = await getSessions();

        // Determine authenticated user server-side
        const authSession = await getServerSession(authOptions);
        const userId = (authSession?.user as any)?.id || null;

        switch (action) {
            case 'create':
            case 'update':
                if (!session) return NextResponse.json({ error: 'Session data required' }, { status: 400 });
                if (ENV.MONGODB_URI && userId) {
                    await upsertUserSession(userId, session);
                } else {
                    const existingIndex = sessions.findIndex(s => s.id === session.id);
                    if (existingIndex >= 0) {
                        sessions[existingIndex] = session;
                    } else {
                        sessions.push(session);
                    }
                }
                break;

            case 'addMessage':
                if (!sessionId || !message) return NextResponse.json({ error: 'Session ID and message required' }, { status: 400 });
                if (ENV.MONGODB_URI && userId) {
                    await addMessageToUserSession(userId, sessionId, message);
                } else {
                    const sessionToUpdate = sessions.find(s => s.id === sessionId);
                    if (sessionToUpdate) {
                        sessionToUpdate.messages.push(message);
                        sessionToUpdate.updatedAt = Date.now();
                    } else {
                        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
                    }
                }
                break;

            case 'rename':
                if (!sessionId || !title) return NextResponse.json({ error: 'Session ID and title required' }, { status: 400 });
                if (ENV.MONGODB_URI && userId) {
                    const userSessions = await getUserSessions(userId);
                    const s = userSessions.find(ss => ss.id === sessionId);
                    if (!s) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
                    s.title = title;
                    s.updatedAt = Date.now();
                    await upsertUserSession(userId, s);
                } else {
                    const sessionToRename = sessions.find(s => s.id === sessionId);
                    if (sessionToRename) {
                        sessionToRename.title = title;
                        sessionToRename.updatedAt = Date.now();
                    } else {
                        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
                    }
                }
                break;

            case 'sync':
                // Bulk update from client (e.g., initial sync)
                if (!body.sessions) return NextResponse.json({ error: 'Sessions array required' }, { status: 400 });
                if (ENV.MONGODB_URI && userId) {
                    const incoming: any[] = body.sessions;
                    for (const sess of incoming) {
                        await upsertUserSession(userId, sess);
                    }
                } else {
                    sessions = body.sessions;
                }
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        if (ENV.MONGODB_URI && userId) {
            const dbSessions = await getUserSessions(userId);
            const sorted = dbSessions.sort((a, b) => b.updatedAt - a.updatedAt);
            return NextResponse.json({ success: true, sessions: sorted });
        }

        await saveSessions(sessions);
        return NextResponse.json({ success: true, sessions });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');
    const clearAll = searchParams.get('all');
    const userId = searchParams.get('userId');

    if (clearAll === 'true') {
        await saveSessions([]);
        return NextResponse.json({ success: true });
    }

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    if (ENV.MONGODB_URI && userId) {
        await deleteUserSession(userId, sessionId as string);
        return NextResponse.json({ success: true });
    }

    let sessions = await getSessions();
    sessions = sessions.filter(s => s.id !== sessionId);
    await saveSessions(sessions);

    return NextResponse.json({ success: true });
}
