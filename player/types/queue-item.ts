import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export type Queue = BaseItemDto | "Recently Played" | "Queue";