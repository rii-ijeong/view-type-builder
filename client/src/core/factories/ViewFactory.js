export default class ViewFactory {

  static exportStandard(data, dataId, type){

    const standardFormat = ViewFactory.buildBasis(data, dataId, type); 
    console.log(data);
    return standardFormat;
  }

  static buildBasis(data, dataId, type){
    return {};
  }
}