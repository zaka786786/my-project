import { _get_common_business_categories } from "../../../DAL/BusinessCategories/business_categories";
import CustomDateFilter from "../../../components/GeneralComponent/CustomDateFilter";
import FilterButtons from "../../../components/GeneralComponent/FilterButtons";
import CustomAutocomplete from "../../../components/CustomeAutoComplete/CustomAutoComplete";

const BusinessFilter = ({
  filterData,
  setFilterData,
  searchFunction,
  handleClearFilter,
}) => {
  const handleSelectOther = (name, value) => {
    setFilterData((values) => ({ ...values, [name]: value }));
  };

  return (
    <div className="container-fluid new-memories mt-3">
      <div className="row">
        <div className="col-12 mt-3">
          <CustomAutocomplete
            fullWidth
            options={null}
            label={"Business Category"}
            getOptionLabel={(option) => option.title || ""}
            value={filterData.category}
            onChange={(newValue) => {
              handleSelectOther("category", newValue);
            }}
            type="business_category"
          />
        </div>
        <CustomDateFilter
          filterData={filterData}
          setFilterData={setFilterData}
        />
      </div>
      <FilterButtons
        searchFunction={searchFunction}
        handleClearFilter={handleClearFilter}
      />
    </div>
  );
};

export default BusinessFilter;
