function checkLoadSheddingAt6AM(loadSheddingData) {
    const formatDate = date => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const today = new Date();
    const todayFormatted = formatDate(today); // Format today's date
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'short' }); // Get short name of current day
    const todaysSchedule = loadSheddingData.schedule.find(d => d.date === `${dayOfWeek} ${todayFormatted}`);
    const isLoadSheddingAt6AM = todaysSchedule ? todaysSchedule.outages.some(outage => {
        const start = new Date(`${todaysSchedule.date} ${outage[0]}`);
        const end = new Date(`${todaysSchedule.date} ${outage[1]}`);
        const sixAM = new Date(`${todaysSchedule.date} 06:00`);
        return start <= sixAM && end >= sixAM;
    }) : false;
    // const loadSheddingText = isLoadSheddingAt6AM ? "Load shedding at 6 AM" : "No load shedding at 6 AM";
    // return loadSheddingText;

    return isLoadSheddingAt6AM;
}

module.exports = { checkLoadSheddingAt6AM };