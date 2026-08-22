export type RectData = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type CircleData = {
    centerX: number;
    centerY: number;
    radius: number;
};

export type Shape =
    | {
          type: "rect";
          data: RectData;
      }
    | {
          type: "circle";
          data: CircleData;
      };