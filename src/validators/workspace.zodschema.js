import { z } from 'zod';

export const workspaceZodSchema = z.object({
    workspaceName: z.string().min(3).max(20)
});
