# PLAYER COMPONENTS NOTES

## OVERVIEW
Audio player UI and context provider for mlog playback.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Player UI | `AudioPlayer.tsx` | Floating player + controls |
| Provider | `PlayerProvider.tsx` | Context/state for tracks |

## CONVENTIONS
- Player state lives in provider; UI consumes context.
