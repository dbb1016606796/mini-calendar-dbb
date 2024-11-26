import "./index.css";

export default function CalendarUi(props) {
  const {
    days,
    dustingColor = "#ccc",
    color = "#333",
    activeDate,
    onDateClick,
    titleRender,
    footerRender,
  } = props;
  const dateNames = [
    "星期天",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];

  return (
    <div className="container">
      <div>{titleRender}</div>
      <div>
        <ul className="title">
          {dateNames.map((v, i) => (
            <li className="content" key={i}>
              {v}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {!!days.length && (
          <>
            {days.map((arr, i) => (
              <ul className="title" key={i}>
                {arr.map((v) => (
                  <li
                    className="content"
                    key={v.day}
                    style={{
                      color: v.flag ? color : dustingColor,
                      background: activeDate === v.day ? "#1677FF" : "",
                    }}
                    onClick={() => {
                      onDateClick && onDateClick(v);
                    }}
                  >
                    <span
                      className="radio"
                      style={{ background: v.remark ? "#f10215" : "" }}
                    ></span>
                    {v.text}
                  </li>
                ))}
              </ul>
            ))}
          </>
        )}
      </div>
      <div>{footerRender}</div>
    </div>
  );
}
