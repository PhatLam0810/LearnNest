import React from 'react';

type CSSProperties = {
  [key: string]: React.CSSProperties;
};

export type StylesProps = CSSProperties;

export class StyleSheet {
  static create<Styles extends CSSProperties>(styles: Styles): Styles {
    return styles;
  }
  static flatten<Styles extends CSSProperties>(...args: Styles[]): Styles {
    return Object.assign({}, ...args);
  }
}
