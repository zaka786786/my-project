import MUICustomTabs from "../../components/MUICustomTabs";
import TransactionsList from "./TransactionsList";
import Sessions from "./Sessions";
import CustomCircularProgress from "../../components/loaders/CustomCircularProgress";
const BusinessPayments = ({
  payments,
  fetchCustomerData,
  handleCancelModalClose,
  openCancelModal,
  cancelModalLoading,
  setCancelModalLoading,
  selectedPayment,
  totalPages,
  pageCount,
  totalCount,
  rowsPerPage,
  page,
  handleChangePages,
  handleChangeRowsPerPage,
  handleChangePage,
  tabValue,
  handleTabChange,
  sessions,
  setSessions,
  isLoading,
  statusModalLoading,
  setStatusModalLoading,
  openStatusModal,
  handleStatusModalClose,
  handleStatusClick,
  show = false,
}) => {
  const TABS_OPTIONS = [
    {
      title: "Payments",
      component: (
        <>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "70vh",
              }}
            >
              <CustomCircularProgress />
            </div>
          ) : (
            <TransactionsList
              status="payments"
              payments={payments}
              fetchCustomerData={fetchCustomerData}
              handleCancelModalClose={handleCancelModalClose}
              openCancelModal={openCancelModal}
              cancelModalLoading={cancelModalLoading}
              setCancelModalLoading={setCancelModalLoading}
              selectedPayment={selectedPayment}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleChangePage={handleChangePage}
              handleChangePages={handleChangePages}
              totalPages={totalPages}
              pageCount={pageCount}
              totalCount={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              statusModalLoading={statusModalLoading}
              setStatusModalLoading={setStatusModalLoading}
              openStatusModal={openStatusModal}
              handleStatusModalClose={handleStatusModalClose}
              handleStatusClick={handleStatusClick}
              show={show}
            />
          )}
        </>
      ),
    },
    {
      title: "Sessions",
      component: (
        <>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "70vh",
              }}
            >
              <CustomCircularProgress />
            </div>
          ) : (
            <Sessions
              status="sessions"
              sessions={sessions}
              setSessions={setSessions}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleChangePage={handleChangePage}
              handleChangePages={handleChangePages}
              totalPages={totalPages}
              pageCount={pageCount}
              totalCount={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              show={show}
            />
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="row mt-4 mb-0">
        {/* {DUMMY_DATA.map((item, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-3">
            <SummaryCard
              color={item.color}
              title={item.title}
              count={item.count}
              icon={item.icon}
            />
          </div>
        ))} */}
      </div>

      <MUICustomTabs
        data={TABS_OPTIONS}
        value={tabValue}
        handleChange={handleTabChange}
      />
    </>
  );
};

export default BusinessPayments;
