import rows from './template/rows'
import normalFilter from './template/normal-filter'
import dropdownPagination from './template/dropdown-pagination'
import columnFilters from './template/column-filters'
import footerHeadings from './template/footer-headings'
import noResults from './template/no-results'
import pagination from './template/pagination'
import dropdownPaginationCount from './template/dropdown-pagination-count'
import headings from './template/headings'
import perPage from './template/per-page'

export default source => function(h) {
    rows(h, this)
    normalFilter(h, this)
    dropdownPagination(h, this)
    columnFilters(h, this)
    footerHeadings(h, this)
    noResults(h, this)
    pagination(h, this)
    dropdownPaginationCount(h, this)
    headings(h, this)
    perPage(h, this)
    return <div class={"VueTables VueTables--" + this.source}>
    <div class="row">
    <div class="col-md-6">
    {normalFilter}
    </div>
    <div class="col-md-6">
    {dropdownPagination}
    {perPage}
    </div>
    </div>
    <div class="table-responsive">
    <table class={'VueTables__table table ' + this.opts.skin}>
    <thead>
    <tr>
    {headings}
    </tr>
    {this.$slots.beforeFilters}  
    {columnFilters}
    {this.$slots.afterFilters}  
    </thead>
    {footerHeadings}
    {this.$slots.beforeBody}      
    <tbody>
    {this.$slots.prependBody}
    {noResults}
    {rows}
    {this.$slots.appendBody}
    </tbody>
    {this.$slots.afterBody}
    </table>
    </div>
    {pagination}
    {dropdownPaginationCount}
    </div>
}
