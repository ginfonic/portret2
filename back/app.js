var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const depsRouter = require('./routes/deps/deps');
const initialRouter = require('./routes/initial/initial');
const footRouter = require('./routes/footNote/footNote');
const etalonRouter = require('./routes/etalon/etalon');
const orderRouter = require('./routes/orders/orders');
const adminRouter = require('./routes/admin/admin');
const logsRouter = require('./routes/admin/logs');
const departmentRouter = require('./routes/department/department');
const matchRouter = require('./routes/match/etalon');
const matchRouter1 = require('./routes/match/error_list');
const matchRouter2 = require('./routes/match/connect');
const matchRouter3 = require('./routes/match/sap');
const matchRouter4 = require('./routes/match/unit_matches');
const depTreeRouter = require('./routes/depTree/depTree');
const colorRouter = require('./routes/colors/colors');
const uploadRouter = require('./routes/fileUpload/fileUpload');
const precountRouter = require('./routes/precount/precount');
const deviationApprovedRouter = require('./routes/deviations/approved/deviationApproved');
const deviationCountUrmRouter = require('./routes/deviations/urmCountSameDep/urmCountSameDep');
const deviationMatchUnitErrorsRouter = require('./routes/deviations/matchErrors/deviationMatchUnitErrors');
const deviationMatchErrorsRouter = require('./routes/deviations/matchErrors/deviationMatchErrors');
const devationGraphsRouter = require('./routes/deviations/graphs/deviationGraphs');
const deviationsRouter = require('./routes/deviations/deviations');
const fnblockRouter = require('./routes/fnblock/fnblock');
const structureRouter = require('./routes/structure/structure');
const errorReportRouter = require('./routes/errorReport/errorReport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
//разрешение cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/deps', depsRouter);
app.use('/initial', initialRouter);
app.use('/footnote', footRouter);
app.use('/etalon', etalonRouter);
app.use('/orders', orderRouter);
app.use('/admin', adminRouter);
app.use('/admin', logsRouter);
app.use('/department', departmentRouter);
app.use('/match', matchRouter);
app.use('/match', matchRouter1);
app.use('/match', matchRouter2);
app.use('/match', matchRouter3);
app.use('/match', matchRouter4);
app.use('/deptree', depTreeRouter);
app.use('/colors', colorRouter);
app.use('/upload', uploadRouter);
app.use('/precount', precountRouter);
app.use('/deviation_approved', deviationApprovedRouter);
app.use('/deviation_count_urm_samedep', deviationCountUrmRouter);
app.use('/deviation_unit_errors', deviationMatchUnitErrorsRouter);
app.use('/deviation_errors', deviationMatchErrorsRouter);
app.use('/deviation_graphs', devationGraphsRouter);
app.use('/deviations', deviationsRouter);
app.use('/fnblock', fnblockRouter);
app.use('/structure', structureRouter);
app.use('/error_report', errorReportRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
