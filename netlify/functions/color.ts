import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { nearestFrom } from "nearest-colors";
import { TailwindDefaultColors } from "./tailwind-colors";

const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  const params = event.queryStringParameters;
  const hex = params && params["hex"];
  if (hex == null) {
    return {
      statusCode: 400,
      body: "Query string parameter hex is required.",
    };
  }
  const color = getNearestTailwindColor(hex);
  if (color) {
    return {
      statusCode: 200,
      body: color,
    };
  } else {
    return {
      statusCode: 400,
      body: `${hex} is not a valid color`,
    };
  }
};

export const getNearestTailwindColor = (hex: string): string | null => {
  const tailwindColors: { [name: string]: string } = {};
  if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }

  for (const key in TailwindDefaultColors) {
    const value = TailwindDefaultColors[key];
    Object.keys(value).forEach((num) => {
      tailwindColors[`${key}-${num}`] = value[num];
    });
  }

  const getNearestTailwindColor = nearestFrom(tailwindColors);
  try {
    const color = getNearestTailwindColor(hex);
    if (Array.isArray(color)) {
      return color[0].name;
    } else {
      return color.name;
    }
  } catch (e) {
    return null;
  }
};

export { handler };
