export default (h, that) => {

  if (!that.opts.footerHeadings) return '';

  const footerHeadings = [];

   if (that.opts.childRow) footerHeadings.push(<th></th>);

    const columns = that.allColumns;

    columns.map(column => {

      footerHeadings.push(<th on-click={that.orderByColumn.bind(that, column)} class={that.sortableClass(column)}><span class="VueTables__heading">{that.getHeading(column)}</span><span
        v-show={that.sortable(column)}
        class="VueTables__sort-icon pull-right"
        class={that.sortableChevronClass(column)}></span></th>)

    })

  return <tfoot><tr>{footerHeadings}</tr></tfoot>


};

