import dayjs from "dayjs";

export const validateSchedule = (schedule) => {
    const error = Array(7).fill(false)
    schedule.forEach((element, idx) => {
        if (element && element.starttime !== '' && element.endtime !== '' && element.starttime.add(1, 'hour').isAfter(element.endtime))
            error[idx] = true
    });
    return error
}