import assert from "node:assert/strict";
import test from "node:test";
import { cropGeometry, type PhotoTransform } from "./photo-crop";

const initial: PhotoTransform = { zoom: 1, x: 0, y: 0, rotation: 0, flipX: false, flipY: false };

test("centers and covers landscape, portrait, and square photos", () => {
  for (const [width, height] of [[800, 600], [600, 800], [600, 600]]) {
    const result = cropGeometry(width, height, 640, initial);
    assert.equal(result.scale, 640 / 600);
    assert.equal(result.offsetX, 0);
    assert.equal(result.offsetY, 0);
  }
});

test("crop stays filled at all pan limits, rotations, zooms, and flips", () => {
  for (const [width, height] of [[1600, 900], [900, 1600], [640, 640]]) {
    for (const rotation of [0, 90, 180, 270]) {
      for (const zoom of [1, 1.5, 3]) {
        for (const x of [-100, 0, 100]) {
          for (const y of [-100, 0, 100]) {
            for (const flipX of [false, true]) {
              for (const flipY of [false, true]) {
                const { scale, offsetX, offsetY } = cropGeometry(width, height, 640, { zoom, x, y, rotation, flipX, flipY });
                const rotatedWidth = rotation % 180 ? height : width;
                const rotatedHeight = rotation % 180 ? width : height;
                assert.ok(320 + offsetX - rotatedWidth * scale / 2 <= 1e-9);
                assert.ok(320 + offsetX + rotatedWidth * scale / 2 >= 640 - 1e-9);
                assert.ok(320 + offsetY - rotatedHeight * scale / 2 <= 1e-9);
                assert.ok(320 + offsetY + rotatedHeight * scale / 2 >= 640 - 1e-9);
              }
            }
          }
        }
      }
    }
  }
});

test("avatar preview and exported photo use proportional crop geometry", () => {
  const transform = { ...initial, zoom: 2.1, x: 74, y: -36, rotation: 90, flipX: true };
  const preview = cropGeometry(1920, 1080, 160, transform);
  const exported = cropGeometry(1920, 1080, 640, transform);
  assert.equal(exported.scale, preview.scale * 4);
  assert.equal(exported.offsetX, preview.offsetX * 4);
  assert.equal(exported.offsetY, preview.offsetY * 4);
});
