export const CellStyle = {
  borderThin: {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  },
  fillYellow: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFF00' },
  },
  fillWhite: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF' },
  },
  alignCenter: {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true,
  },
};
