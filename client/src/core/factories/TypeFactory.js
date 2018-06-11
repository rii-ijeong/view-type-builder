export default class TypeFactory {
  static classMapping = {
    'enum': 'com.project.model.type.EnumAttr',
    'string': 'com.project.model.type.StringAttr',
    'date': 'com.project.model.type.DateAttr',
    'object': 'com.project.model.type.DomainObjectAttr',
    'boolean': 'com.project.model.type.BooleanAttr',
    'attachment': 'com.project.model.type.AttachmentAttr',
    'number': 'com.project.model.type.LongAttr'
  }

  static exportStandard(typeObject){
    return {};
  }

  static importStandard(data){
    return {};
  }
}