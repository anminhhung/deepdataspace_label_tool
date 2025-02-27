import { useCallback, useEffect, useMemo, useRef } from 'react';
import { getCategoryColors, hsvToRgb, rgbArrayToHex } from '../utils/color';
import { Category, EditState } from '../type';

interface IProps {
  categories: Category[];
  editState: EditState;
}

export default function useColor({ categories, editState }: IProps) {
  const labelColors = useMemo(() => {
    return getCategoryColors(categories.map((item) => item.name));
  }, [categories]);

  const colorSeedRef = useRef(0);

  const getUniformHexColor = (seed: number) => {
    // update seed
    const goldenRatio = 0.618;
    colorSeedRef.current = seed + goldenRatio;

    // generate uniform hex color
    const hue = (seed + goldenRatio) % 1;
    const rgbColor = hsvToRgb(hue, 0.8, 0.95);
    return rgbArrayToHex(rgbColor);
  };

  useEffect(() => {
    // reset seed
    colorSeedRef.current = 0;
  }, [editState.annotsDisplayOptions.colorByCategory]);

  const getAnnotColor = useCallback(
    (category: string, forceColorByCategory?: boolean) => {
      if (
        editState.annotsDisplayOptions.colorByCategory ||
        forceColorByCategory
      ) {
        return labelColors[category] || '#fff';
      } else {
        return getUniformHexColor(colorSeedRef.current);
      }
    },
    [
      editState.annotsDisplayOptions.colorByCategory,
      labelColors,
      getUniformHexColor,
      colorSeedRef.current,
    ],
  );

  return {
    labelColors,
    getAnnotColor,
  };
}
