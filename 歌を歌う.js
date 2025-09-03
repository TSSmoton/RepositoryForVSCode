/**
 * メモエリア: AccessRightインスタンスの使い方
 * 引数: 閲覧, 編集, ACL取得, ACL設定, 削除, 文書追加, 文書削除, 返答
 * readable, writable, acl_gettable, acl_settable, deletable, elem_creatable, elem_deletable, child_creatable
 * 例: var readOnlyRight = ariel.consts.AGN.acl.AccessRight.instance(true, false, true, false, false, true, false, true);
 * ariel.consts.READ_RIGHT: readable, acl_gettable, elem_creatable が true の AccessRightインスタンス
 * 値: r-g--c--
 */

// 下書き保存でない場合の処理
if (!isSaveDraft) {
    // システム管理者トークン取得
    var rootToken = ariel.global.getRootToken();
    // リソース取得（管理者権限で）
    var res = resourceLoader.loadResource(resource.getId(), rootToken);
    var aclElemList = res.getAcl();

    // グループリストのACL追加
    for (var it = groupList.iterator(); it.hasNext();) {
        var record = it.next();
        aclElemList.add(new agn.acl.AclElem(record, ariel.consts.READ_RIGHT));
    }

    // 申請者フィールド取得
    var shinseiUserId = ru.intValue("shinsei_user");
    // 作成者と申請者が異なる場合、申請者に閲覧権限がなければ付与
    if (ru.intValue("creator") !== shinseiUserId) {
        util.info("作成者：" + ru.intValue("creator") + "\n申請者:" + shinseiUserId);
        if (!ariel.acl.isReadable(resource, shinseiUserId)) {
            util.info("申請者は閲覧権限がないユーザーです");
            aclElemList.add(new agn.acl.AclElem(shinseiUserId, ariel.consts.READ_RIGHT));
        }
    }

    // ACLセット
    ariel.acl.setAcl(res, aclElemList);
}