import PropTypes from "prop-types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { fShortenNumber } from "../../../utils/constant";

BusinessCustomerStatCards.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string.isRequired,  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  is_show_icon: PropTypes.bool,
  currency_component: PropTypes.node,
};

export default function BusinessCustomerStatCards({
  title,
  count,
  icon,
  currency_component,
  color,
}) {
  return (
    <div
      className=" custom-shadow  p-3 rounded-3 d-flex flex-column hover-card transition  mb-0"
      style={{
        transition: "all 0.3s ease",
        minHeight: "65px",
      }}
    >
      <div className="d-flex flex-column align-items-center justify-content-between w-auto  mb-2 ">
        <div className="d-flex align-items-center justify-content-center business-category-icon  rounded-circle p-2 ">
          <Icon icon={icon}  width={25} height={25} />
        </div>
      </div>
      <div className="d-flex flex-column justify-content-between flex-grow-1">
        <p
          className="text-muted mb-0 mx-auto "
          style={{
            fontSize: 14,
            lineHeight: 1.2,
            fontWeight: 500,
            color: "#595959",
            flexGrow: 1,
            textAlign: "center",
          }}
        >
          {title}
        </p>

        <h3
          className="mt-1 mb-0 text-dark"
          style={{
            fontSize: 18,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {currency_component || null}
          {typeof count === "number" ? fShortenNumber(count) : count}
        </h3>
      </div>
    </div>
  );
}
// import PropTypes from "prop-types";
// import { Icon } from "@iconify/react/dist/iconify.js";
// import { fShortenNumber } from "../../../utils/constant";

// BusinessCustomerStatCards.propTypes = {
//   color: PropTypes.string,
//   icon: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   is_show_icon: PropTypes.bool,
//   currency_component: PropTypes.node,
// };

// export default function BusinessCustomerStatCards({
//   title,
//   count,
//   icon,
//   currency_component,
//   color,
// }) {
//   return (
//     <div
//       className=" custom-shadow  p-3 rounded-3 d-flex flex-row hover-card transition  mb-0"
//       style={{
//         transition: "all 0.3s ease",
//         minHeight: "65px",
//       }}
//     >
//       <div className="d-flex align-items-center justify-content-between w-auto  mb-1 ">
//         <div className="d-flex align-items-center  ">
//           <Icon icon={icon} color={color} width={24} height={24} />
//         </div>

//         {/* <p
//           className="text-muted mb-0 mx-auto"
//           style={{
//             fontSize: 13,
//             lineHeight: 1.2,
//             fontWeight: 500,
//             color: "#595959",
//             flexGrow: 1,
//             textAlign: "center",
//           }}
//         >
//           {title}
//         </p> */}

//       </div>
//       <div className="d-flex flex-column justify-content-between flex-grow-1">
//       <p
//           className="text-muted mb-0 mx-auto "
//           style={{
//             fontSize: 13,
//             lineHeight: 1.2,
//             fontWeight: 500,
//             color: "#595959",
//             flexGrow: 1,
//             textAlign: "center",
//           }}
//         >
//           {title}
//         </p>

//         <h3
//           className="mt-1 mb-0 text-dark"
//           style={{
//             fontSize: 18,
//             fontWeight: 700,
//             textAlign: "center",
//           }}
//         >
//           {currency_component || null}
//           {typeof count === "number" ? fShortenNumber(count) : count}
//         </h3>
//       </div>

//       {/* <div style={{ width: "24px" }}></div> */}
//     </div>
//   );
// }
