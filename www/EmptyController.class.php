<?php
// +----------------------------------------------------------------------
// | OneThink [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2013 http://www.onethink.cn All rights reserved.
// +----------------------------------------------------------------------
// | Author: 麦当苗儿 <zuojiazi@vip.qq.com> <http://www.zjzit.cn>
// +----------------------------------------------------------------------

namespace Home\Controller;

use Common\Controller\HomeController;
/**
 * 空模块，主要用于显示404页面，请不要删除
 */
class EmptyController extends HomeController{
	//没有任何方法，直接执行HomeController的_empty方法
	//请不要删除该控制器
	
    function _empty(){        $this->_seo['title'] = '您访问的页面不存在';        $this->_seo['keywords'] = '您访问的页面不存在！';        $this->_seo['description'] = '您访问的页面不存在！';        $this->assign('seo', $this->_seo);
        header( " HTTP/1.0  404  Not Found" );
        $this->display( 'Public:404' );
    }
    
    
    
    function  index(){
     $this->_seo['title'] = '您访问的页面不存在';            $this->_seo['keywords'] = '您访问的页面不存在！';            $this->_seo['description'] = '您访问的页面不存在！';            $this->assign('seo', $this->_seo);
        header( " HTTP/1.0  404  Not Found" );
    
        $this->display( 'Public:404' );
    
    }
    
}
