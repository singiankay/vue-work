 import debounce from 'debounce';

 export default (h, that) => {

       const search = that.source=='client'?
             that.search.bind(that, that.data):
             that.serverSearch.bind(that);

   return column => <input
   on-keyup={debounce(search,that.opts.debounce)}
   class="form-control"
   name={`vf__${column}`}
   type="text"
   placeholder={that.display('filterBy',{column:that.getHeading(column)})}
   value={that.query[column]}
   />
};

