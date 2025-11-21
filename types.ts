export interface Track {
  id: string;
  title: string;
  originalIndex: number;
}

export interface AlbumData {
  artist: string;
  title: string;
  genre: string;
  tracks: Track[];
}

export interface SequencedTrack {
  trackNumber: number;
  title: string;
  reasoning: string;
  transitionNote?: string;
}

export interface SequenceResult {
  sequencedTracks: SequencedTrack[];
  albumAnalysis: string;
  narrativeArc: string;
}

export enum AppState {
  IDLE = 'IDLE',
  INPUT_DETAILS = 'INPUT_DETAILS',
  INPUT_TRACKS = 'INPUT_TRACKS',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}