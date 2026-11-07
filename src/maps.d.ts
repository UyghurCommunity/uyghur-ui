export interface MapMetadata {
  readonly id: string;
  readonly name: { readonly ug: string; readonly en: string };
  readonly boundaryBasis: { readonly ug: string; readonly en: string };
  readonly source: { readonly provider: string; readonly dataset: string; readonly scale: string; readonly layerVersion: string; readonly repositoryRelease: string; readonly repositoryCommit: string; readonly url: string; readonly rawUrl: string; readonly datasetPage: string; readonly license: string; readonly licenseUrl: string; readonly credit: string; readonly sourceFeature: { readonly name: string; readonly adm1_code: string; readonly iso_3166_2: string; readonly ne_id: number }; readonly globalGeoJSONSHA256: string; readonly extractedGeoJSONSHA256: string; readonly extractedGeoJSON: string; readonly accessed: string };
  readonly geometry: { readonly type: string; readonly coordinateReferenceSystem: string; readonly bbox: readonly number[]; readonly polygonCount: number; readonly ringCount: number; readonly sourceVertexCount: number; readonly renderedVertexCount: number; readonly simplification: string };
  readonly projection: { readonly name: string; readonly standardParallel: number; readonly units: string; readonly orientation: string; readonly viewBox: string; readonly width: number; readonly height: number; readonly padding: number };
  readonly assets: { readonly outline: string; readonly filled: string };
}
export declare const mapMetadata: MapMetadata;
export declare function mapSVG(options?: { width?: number; variant?: 'outline' | 'filled'; label?: string; color?: string; strokeWidth?: number }): string;
