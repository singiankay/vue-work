export default (h, that) => {
  const perpageValues = [];

  that.opts.perPageValues.every(value => {
    const isLastEntry = value >= that.count;
    const selected = that.limit==value || (isLastEntry && that.limit>value);
    perpageValues.push(<option value={value} selected={selected}>{value}</option>)
    return !isLastEntry;
  });

  return perpageValues;

};

