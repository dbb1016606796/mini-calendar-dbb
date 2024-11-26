import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import MiniCalendarUi from "./Ui";

export default function Calendar() {
  const format = "YYYY-MM-DD";
  const titleFormat = "YYYY-MM";
  const [dates, setDates] = useState([]);
  const [title, setTitle] = useState(dayjs().format(titleFormat));
  const [activeDate, setActiveDate] = useState("");
  const [remark, setRemark] = useState("");
  const [open, setOpen] = useState(false);

  const nowDate = useRef(dayjs().format(format));
  // 保存备注永的，用日期作为key值
  const remarkObj = useRef(new Map());

  // 生成天数的节点信息
  const createDayObj = (day, flag = true) => ({
    day,
    text: dayjs(day).format("DD"),
    flag,
    remark: remarkObj.current.get(day) || "",
  });

  function getDateBetween(start, end) {
    var result = [];
    //使用传入参数的时间
    var startTime = new Date(start);
    var endTime = new Date(end);
    while (endTime - startTime >= 0) {
      let year = startTime.getFullYear();
      let month = startTime.getMonth();
      month = month < 9 ? "0" + (month + 1) : month + 1;
      let day =
        startTime.getDate().toString().length == 1
          ? "0" + startTime.getDate()
          : startTime.getDate();
      //加入数组
      result.push(year + "-" + month + "-" + day);
      //更新日期
      startTime.setDate(startTime.getDate() + 1);
    }
    return result;
  }

  function chunkArray(array, chunkSize = 7) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  }

  function computeFunc(date) {
    const givenDate = dayjs(nowDate.current);
    // 获取月份的第一天和最后一天
    const firstDayOfMonth = givenDate.startOf("month");
    const endOfMonth = givenDate.endOf("month");

    const formattedDays = getDateBetween(
      firstDayOfMonth.format(format),
      endOfMonth.format(format)
    ).map((day) => createDayObj(day));

    // 上个月的天数
    let lastMonthDays = [];
    // 判断当前月的第一天是否是礼拜天
    // day() 方法返回星期几，0 表示星期天
    if (firstDayOfMonth.day() !== 0) {
      // 获取上个月应该显示的开始日期
      const lastMonthDay = firstDayOfMonth.subtract(
        firstDayOfMonth.day(),
        "day"
      );
      lastMonthDays = getDateBetween(
        lastMonthDay.format(format),
        lastMonthDay.endOf("month").format(format)
      ).map((day) => createDayObj(day, false));
    }

    // 下个月的天数
    const nextMonthDays = [];
    // 判断当月最后一天是否是礼拜六，因为是以礼拜天为第一天
    const endDayNum = endOfMonth.day();
    if (endDayNum !== 6) {
      // 计算到下一个星期天的天数差
      const daysUntilSunday = 6 - endDayNum;
      let beginDate = endOfMonth.format(format);
      for (let i = 0; i < daysUntilSunday; i++) {
        beginDate = dayjs(beginDate).add(1, "day").format(format);
        nextMonthDays.push(createDayObj(beginDate, false));
      }
    }

    const arr = chunkArray([
      ...lastMonthDays,
      ...formattedDays,
      ...nextMonthDays,
    ]);
    setDates(arr);
  }

  function onBtn(funcName) {
    nowDate.current = dayjs(nowDate.current)
      [funcName](1, "month")
      .format("YYYY-MM-01");
    setTitle(dayjs(nowDate.current).format(titleFormat));
  }

  function onDateClick(obj) {
    const { day } = obj;

    setOpen(true);
    // 查找有没有备注
    const text = remarkObj.current.get(day) || "";
    setRemark(text);

    if (activeDate && day === activeDate) {
      onCancel();
      setActiveDate("");
    } else {
      setActiveDate(day);
    }
  }

  function onTextareChange(e) {
    setRemark(e.target.value);
  }

  function onCancel() {
    setOpen(false);
  }

  function onSave() {
    remarkObj.current.set(activeDate, remark);
    onCancel();
    // 这里需要手动去触发刚刚输完之后的日历红点
    setDates(
      dates.map((arr) =>
        arr.map((v) => ({ ...v, remark: v.day === activeDate ? remark : "" }))
      )
    );
  }

  useEffect(() => {
    computeFunc();
  }, [title]);

  return (
    <div>
      <MiniCalendarUi
        days={dates}
        activeDate={activeDate}
        onDateClick={onDateClick}
        titleRender={
          <div>
            <h2 style={{ textAlign: "center" }}>{title}</h2>
            <div className="btns">
              <button
                style={{ marginRight: 10 }}
                onClick={() => onBtn("subtract")}
              >
                上个月
              </button>
              <button onClick={() => onBtn("add")}>下个月</button>
            </div>
          </div>
        }
        footerRender={
          <div style={{ marginTop: 20 }}>
            <h3 style={{ textAlign: "center" }}>
              {activeDate ? `当前选择的⽇期是：${activeDate}` : ""}
            </h3>
          </div>
        }
      />
      {/* 懒得写弹框了，就先秉承着，能跑就行把 */}
      <>
        {open && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <textarea
              style={{ minWidth: 300, minHeight: 60 }}
              value={remark}
              onChange={onTextareChange}
            />
            <button style={{ marginRight: 6 }} onClick={onCancel}>
              取消
            </button>
            <button onClick={onSave}>保存</button>
          </div>
        )}
      </>
    </div>
  );
}
